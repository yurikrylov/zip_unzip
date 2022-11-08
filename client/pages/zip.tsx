import React from 'react';
import MainLayout from "../layouts/MainLayout";
import Login from "../components/Login";
import {Button} from "@mui/material";
const Index = () => {
    let [file, setFile] = React.useState(null);


    async function uploadFile() {
        if (!file) return;
        let body = new FormData();
        body.append("file", file);
        let res = await fetch(process.env.outsideAddress + '/api/zipUpload', {
            method: 'POST',
            body: body
        });
    }

    return (
        <MainLayout>
            <div>
                <Button
                    variant="contained"
                    component="label"
                >
                    {file ? file.name.slice(0,50) : 'Выберите файл'}
                    <input
                        type="file"
                        hidden
                        onChange={(e) => {
                            setFile(e.target.files[0])
                        }}
                    />
                </Button>
                <Button
                    component="label"
                    onClick={uploadFile}
                >Загрузить файл</Button>
            </div>

        </MainLayout>
    );
};

export default Index;
