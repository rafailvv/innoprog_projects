import { Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import ApiService from '../services/ApiService';
import { useState } from 'react';


export interface SimpleDialogProps {
    open: boolean;
    submissionId: number | undefined;
    onClose: () => void;
}

function SubmissionDialog(props: SimpleDialogProps) {
    const { open, submissionId, onClose } = props
    const [github, setGithub] = useState('');
    const [file, setFile] = useState<File>();
    const [solutionName, setSolutionName] = useState('');

    const handleSubmit = async () => {

        try {
            if (submissionId !== undefined) {
                console.log(file)
                const resp = await ApiService.postSubmissionByCheckPointId(
                    submissionId,
                    github,
                    solutionName,
                    file
                )
                console.log(resp)
            }
            onClose();

        } catch (err) {
            console.error(err)
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ p: 2 }}
        >
            <DialogTitle variant="h4" fontWeight="bold">
                ЗАГРУЗКА РЕШЕНИЯ
            </DialogTitle>
            <DialogContent>

                <Typography variant="h6" fontWeight="bold">
                    Название решения
                </Typography>
                <TextField
                    value={solutionName}
                    onChange={(e) => setSolutionName(e.target.value)}
                    placeholder='Улучшение функции...'
                    fullWidth
                />

                <Typography variant="h6" fontWeight="bold">
                    Загрузка файла с решением
                </Typography>
                <input type="file" onChange={(e) => {
                    if(e.target.files)
                        setFile(e.target.files[0])
                }} />

                <Typography variant="h6" fontWeight="bold">
                    Ссылка на код решения
                </Typography>
                <TextField
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder='https://...'
                    fullWidth
                />
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{ mt: 2, mb: 1 }}
                >
                    Опубликовать
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default SubmissionDialog