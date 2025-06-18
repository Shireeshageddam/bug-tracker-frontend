// src/pages/KanbanBoard.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { createPortal } from 'react-dom';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const PortalAwareDraggable = ({ children, ...props }) => {
  return (
    <Draggable {...props}>
      {(provided, snapshot) => {
        const child = children(provided, snapshot);
        if (!snapshot.isDragging) return child;
        return createPortal(child, document.body);
      }}
    </Draggable>
  );
};

export default function KanbanBoard() {
  const { projectId } = useParams();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, [projectId]);

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('project_id', projectId);

    if (!error) {
      setTickets(data);
    } else {
      toast.error("Failed to fetch tickets.");
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const newStatus = destination.droppableId;
    const ticketId = draggableId;

    const { error } = await supabase
      .from('tickets')
      .update({ status: newStatus })
      .eq('id', ticketId);

    if (error) {
      toast.error("Failed to update ticket status.");
    } else {
      toast.success("Ticket status updated.");
      fetchTickets();
    }
  };

  const groupedTickets = {
    'To Do': [],
    'In Progress': [],
    'Done': [],
  };

  tickets.forEach((ticket) => {
    groupedTickets[ticket.status]?.push(ticket);
  });

  const priorityColors = {
    Critical: 'bg-red-100 text-red-700',
    High: 'bg-orange-100 text-orange-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
  };

  const statusStyles = {
    'To Do': 'border-blue-300',
    'In Progress': 'border-yellow-400',
    'Done': 'border-green-400',
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <Link
        to={`/projects/${projectId}/tickets`}
        className="text-blue-600 hover:underline text-sm mb-4 block"
      >
        ← Back to Tickets
      </Link>

      <h2 className="text-3xl font-bold text-gray-800 mb-8">Kanban Board</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(groupedTickets).map(([status, tickets]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white border-t-4 rounded-xl shadow-md p-4 min-h-[500px] ${statusStyles[status]}`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{status}</h3>

                  {tickets.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No tickets</p>
                  )}

                  {tickets.map((ticket, index) => (
                    <PortalAwareDraggable
                      key={ticket.id}
                      draggableId={ticket.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        const dragStyle = {
                          ...provided.draggableProps.style,
                          zIndex: snapshot.isDragging ? 1000 : 'auto',
                          transform: snapshot.isDragging
                            ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                            : provided.draggableProps.style?.transform,
                        };

                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={dragStyle}
                            className={`bg-white border rounded-xl px-4 py-3 mb-4 shadow-sm transition-all duration-200 ${
                              snapshot.isDragging
                                ? 'shadow-2xl scale-105 ring-2 ring-indigo-300'
                                : 'hover:shadow-md'
                            }`}
                          >
                            <h4 className="text-base font-medium text-indigo-700 mb-1">{ticket.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-3 italic mb-2">
                              {ticket.description}
                            </p>

                            <div className="flex justify-between items-center text-xs">
                              <span
                                className={`px-2 py-1 rounded-full font-semibold ${priorityColors[ticket.priority]}`}
                              >
                                {ticket.priority}
                              </span>
                              <span className="text-gray-400 cursor-move text-lg">⋮⋮</span>
                            </div>
                          </div>
                        );
                      }}
                    </PortalAwareDraggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
