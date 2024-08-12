import { Chip, Paper, Switch, Typography } from '@mui/material'
import { SubmissionItem } from '../models/types'
import { useState } from 'react'
import ApiService from '../services/ApiService'

function PaperSubmission({ value, onChange }: { value: SubmissionItem, onChange: (value: SubmissionItem) => void }) {
    const [is_visible, setIsVisible] = useState<boolean>(value.is_visible)

    const changeVisibility = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            event.stopPropagation()
            if (is_visible) {
                const resp = await ApiService.postSubmissionClose(value.id)
                console.log(resp)
                setIsVisible(false)
                onChange({ ...value, is_visible: false })

            } else {
                const resp = await ApiService.postSubmissionOpen(value.id)
                console.log(resp)
                setIsVisible(true);
                onChange({ ...value, is_visible: true })

            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Paper
            onClick={() => console.log(value)}
            sx={{ p: 1, mb: 1, display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'primary.light' }}
            elevation={0}
        >
            <Chip label={"3.2"} color="primary" />
            <Switch checked={is_visible} onChange={changeVisibility} />
            <Typography>{value.name}</Typography>
        </Paper>
    )
}

export default PaperSubmission