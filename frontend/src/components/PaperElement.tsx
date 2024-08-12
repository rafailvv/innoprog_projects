import { Paper, Typography } from '@mui/material'


function PaperElement({title, description}: {title: string | undefined, description: string | undefined}) {
  return (
    <Paper elevation={3} sx={{p: 2}}>
        <Typography variant="h5" fontWeight="bold">
            {title}
        </Typography>
        <Typography variant="h6">
            {description}
        </Typography>
    </Paper>
  )
}

export default PaperElement