import React, { useState } from 'react';
import axios from 'axios';
import { useDataContext } from '../providers/DataProvider';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  width: 300px;
  margin: 0 auto;
`;

const Input = styled.input`
  margin-bottom: 10px;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const { setApiData } = useDataContext();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { summarizationAvailable, chartsAvailable, typesAndFormats, fieldsAvailable, data } = response.data;
      setApiData(summarizationAvailable, chartsAvailable, typesAndFormats, fieldsAvailable, data);
      console.log('File uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Container>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleFileUpload}>Upload</Button>
    </Container>
  );
};

export default FileUpload;