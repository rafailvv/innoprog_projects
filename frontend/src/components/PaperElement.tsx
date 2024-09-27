import { Paper, Typography } from '@mui/material'


function PaperElement({title, description, children}: {title: string | undefined, description?: string, children?: React.ReactNode}) {
  return (
    <Paper elevation={3} sx={{p: 2, mb: 2, borderRadius: 4}}>
        <Typography variant="h5" fontWeight="bold">
            {title}
        </Typography>
        {children}
        <Typography variant="h6">
            {description}
        </Typography>
    </Paper>
  )
}

export default PaperElement