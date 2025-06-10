import React from 'react';
import Modal from '@/components/molecules/Modal';
import TaskForm from '@/components/organisms/TaskForm';

const TaskModal = ({ isOpen, onClose, onSubmit, title, initialData }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <TaskForm onSubmit={onSubmit} initialData={initialData} onClose={onClose} />
    </Modal>
  );
};

export default TaskModal;