import React, { useState } from 'react';
import type { CreateTodoData } from '../../types';
import { VALIDATION_RULES } from '../../constants';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTodoData) => Promise<void>;
  title: string;
}

const TodoForm: React.FC<TodoFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: '',
  });
  
  const [errors, setErrors] = useState<{
    title?: string;
  }>({});
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.title.trim()) {
      newErrors.title = VALIDATION_RULES.TODO_TITLE.required;
    } else if (formData.title.length > 100) {
      newErrors.title = VALIDATION_RULES.TODO_TITLE.maxLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
      });
      
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
      });
      setErrors({});
    } catch (error) {
   
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(value) => handleInputChange('title', value)}
          placeholder="What needs to be done?"
          error={errors.title}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Add more details..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date (optional)
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Todo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TodoForm; 