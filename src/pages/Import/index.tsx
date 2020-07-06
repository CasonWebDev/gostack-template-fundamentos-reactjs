import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    await Promise.all(
      uploadedFiles.map(async file => {
        const data = new FormData();
        data.append('file', file.file);
        try {
          await api.post('/transactions/import', data);
        } catch (err) {
          console.log(err);
        }
      }),
    ).then((): void => {
      history.replace('/');
    });
  }

  function submitFile(files: File[]): void {
    const upload = files.map(
      (file): FileProps => {
        return {
          file,
          name: file.name,
          readableSize: filesize(file.size),
        };
      },
    );

    setUploadedFiles([...uploadedFiles, ...upload]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
