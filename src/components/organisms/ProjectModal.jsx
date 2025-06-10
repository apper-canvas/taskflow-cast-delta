import React from 'react';
import Modal from '@/components/molecules/Modal';
import ProjectForm from '@/components/organisms/ProjectForm';

const ProjectModal = ({ isOpen, onClose, onSubmit, title, initialData }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <ProjectForm onSubmit={onSubmit} initialData={initialData} onClose={onClose} />
    </Modal>
  );
};

export default ProjectModal;