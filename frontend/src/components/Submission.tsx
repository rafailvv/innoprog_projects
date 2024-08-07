import { Box, Button, Typography } from "@mui/material"
import { FeedbackRequest, SubmissionItem } from "../models/types"
import FeedbackDialog from "./FeedbackDialog"
import { useState } from "react";

function Submission({ submission }: { submission: SubmissionItem }) {
    const [open, setOpen] = useState(false);
    function closeFeedbackDialog(value: FeedbackRequest): void {
        setOpen(false);
    }

    return (
        <>
            <FeedbackDialog open={open} onClose={closeFeedbackDialog} submissionId={submission.id} />
            <Button sx={{ overflowX: 'auto', paddingBottom: '15px' }} onClick={() => setOpen(true)}>
                <Box textAlign={"left"}>
                    <Typography variant="h6" fontWeight="bold">
                        Решение от {submission.user.first_name}
                    </Typography>
                    <Typography variant="body1">
                        Ссылка: {submission.github}
                    </Typography>
                </Box>
            </Button>
        </>


    )
}

export default Submission