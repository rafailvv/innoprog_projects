import { Dialog, TextField, Typography } from '@mui/material'
import { SubmissionItem } from '../models/types';
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
    const [file, setFile] = useState('');
    const [solutionName, setSolutionName] = useState('');

    const handleClose = async () => {

        try {
            if (submissionId !== undefined) {
                const resp = await ApiService.postSubmissionByCheckPointId(
                    submissionId,
                    github,
                    file,
                    solutionName
                )
                console.log(resp)
                
            }
            onClose();

        } catch (err) {
            console.error(err)
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <Typography variant="h5" fontWeight="bold">
                Загрузка решения
            </Typography>

            <Typography variant="h6" fontWeight="bold">
                Ссылка на код решения
            </Typography>
            <TextField>
                
            </TextField>
        </Dialog>
    )
}

export default SubmissionDialog