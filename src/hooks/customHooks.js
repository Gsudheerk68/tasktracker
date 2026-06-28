import React, { useState, useCallback } from 'react';

// Validation functions
export const validators = {
  title: (value) => {
    if (!value || value.trim().length === 0) {
      return 'Task title is required';
    }
    if (value.length > 100) {
      return 'Title must be less than 100 characters';
    }
    return '';
  },

  description: (value) => {
    if (value && value.length > 500) {
      return 'Description must be less than 500 characters';
    }
    return '';
  },

  priority: (value) => {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(value)) {
      return 'Invalid priority level';
    }
    return '';
  },

  dueDate: (value) => {
    if (value && new Date(value) < new Date()) {
      return 'Due date must be in the future';
    }
    return '';
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Invalid email address';
    }
    return '';
  }
};

// useForm Hook - Manages form state and validation
export const useForm = (initialValues, onSubmit, validate = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name, value) => {
    if (validate[name]) {
      return validate[name](value);
    }
    return '';
  }, [validate]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({ ...prev, [name]: newValue }));

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validateField]);

  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Validate all fields
    const newErrors = {};
    Object.keys(values).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (err) {
        // Error handled in parent component
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateField, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues
  };
};

// useAsync Hook - Handles async operations
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  // Call on mount if immediate is true
  const init = useCallback(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    init,
    status,
    value,
    error
  };
};

// usePrevious Hook - Get previous value
export const usePrevious = (value) => {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default useForm;
