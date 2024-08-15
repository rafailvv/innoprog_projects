import { Avatar, Chip, Paper, Switch, Typography } from '@mui/material'
import { SubmissionItem } from '../models/types'
import { useState } from 'react'
import ApiService from '../services/ApiService'
import { useNavigate } from 'react-router-dom'
import FeedbackDialog from './FeedbackDialog'

function PaperSubmission({ value, onChange, externalSubmission }: { value: SubmissionItem, onChange: (value: SubmissionItem) => void, externalSubmission?: boolean }) {
    const [is_visible, setIsVisible] = useState<boolean>(value.is_visible)
    const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false)
    const navigator = useNavigate();

    const changeVisibility = async (_: React.ChangeEvent<HTMLInputElement>) => {
        try {
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
        <>
            <FeedbackDialog open={feedbackOpen} onClose={() => { setFeedbackOpen(false) }} submissionId={value.id} />
            <Paper
                onClick={() => {
                    if (externalSubmission) {
                        setFeedbackOpen(true)
                        return;
                    }
                    return navigator('' + value.id, {
                        state: {
                            submission: value
                        }
                    })
                }}
                sx={{ cursor: 'pointer', p: 1, mb: 1, display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'primary.light' }}
                elevation={0}
            >
                {externalSubmission ?
                    <>
                        <Avatar src={value.user.photo_fase} />
                        <Typography>{value.user.first_name} {value.user.last_name}</Typography>
                    </>
                    :
                    <>
                        <Chip label={"3.2"} color="primary" />
                        <Switch checked={is_visible} onClick={(event) => { event.stopPropagation() }} onChange={changeVisibility} />
                    </>
                }
                <Typography>{value.name}</Typography>
            </Paper>
        </>
    )
}

export default PaperSubmission