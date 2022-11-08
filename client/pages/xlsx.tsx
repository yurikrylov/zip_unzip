import React from 'react';
import MainLayout from "../layouts/MainLayout";
import Login from "../components/Login";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {getCookie} from "cookies-next";
import {Button} from "@mui/material";
const Index = () => {
    let [tokenCookie, setTokenCookie] = React.useState(getCookie('token'));
    let {token} = useTypedSelector(state => state.token);
    let [file, setFile] = React.useState(null);


    async function uploadFile() {
        console.log(token)
        if (!file) return;
        let body = new FormData();
        body.append("file", file);
        let res = await fetch(process.env.outsideAddress + '/api/xlsxUpload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: body
        });
    }

    return (
        <MainLayout>
            {!tokenCookie && <Login />}
            <div>
                <Button
                    variant="contained"
                    component="label"
                >
                    {file ? file.name.slice(0,50) : 'Выберите файл'}
                    {/* Ответ справочной службы русского языка:
                        Написание зависит от формы глагола. 
                        В повелительном наклонении следует писать выберите; 
                        в форме будущего времени изъявительного наклонения - выберете.*/
                    }
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
