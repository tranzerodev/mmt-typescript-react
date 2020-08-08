import React, { useState } from 'react';
import * as Yup from 'yup';
import { Node } from 'slate';
import { Box, TextField } from '@material-ui/core';
import { FormBodyAPI } from '../../constants/propTypes';
import { SlateTextEditor } from '../TextEditor';

export const useResourceForm = () => {
  const validationScheme = Yup.object().shape({
    title: Yup.string()
      .max(255)
      .required('Resource title is required'),
  });

  const [editorValue, setEditorValue] = useState<Node[]>([
    {
      children: [{ text: 'Enter a descriptive body for this resource' }],
    },
  ]);

  const getSubmitValues = async () => ({
    slateEditorValue: JSON.stringify(editorValue),
  });

  const FormRenderer: React.FC<FormBodyAPI> = ({
    touched,
    errors,
    handleBlur,
    handleChange,
    values,
  }) => (
    <>
      <Box p={3}>
        <TextField
          error={Boolean(touched.title && errors.title)}
          fullWidth
          helperText={touched.title && errors.title}
          label="Title"
          name="title"
          id="input-resource-title"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.title}
          variant="outlined"
        />
      </Box>
      <Box p={3}>
        <SlateTextEditor value={editorValue} setValue={setEditorValue} />
      </Box>
    </>
  );

  return { validationScheme, getSubmitValues, FormRenderer };
};
