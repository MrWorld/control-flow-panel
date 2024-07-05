import React from 'react'
import {
    Grid,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from '@mui/material';
import { Formik } from 'formik';

const UpdateModal = ({ show, onHide, title, subtitle, initialValues, validationSchema, onSubmitCustomAction, fields, onCancel, buttonText }) => {
    return (
        <Dialog
            fullWidth
            maxWidth="md"
            open={show}
            onClose={onHide}
        >
            <DialogTitle
                sx={{
                    p: 3
                }}
            >
                <Typography variant="h4" gutterBottom>
                    {title || 'setup a title'}
                </Typography>
                <Typography variant="subtitle2">
                    {
                        subtitle || 'setup a subtitle'
                    }
                </Typography>
            </DialogTitle>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (
                    _values,
                    { resetForm, setStatus, setSubmitting }
                ) => onSubmitCustomAction(_values, resetForm, setStatus, setSubmitting)}
            >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values
                }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogContent
                            dividers
                            sx={{
                                p: 3
                            }}
                        >
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={7}>
                                    {fields( errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values )}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions
                            sx={{
                                p: 3
                            }}
                        >
                            <Button color="secondary" onClick={onCancel}>
                                {'Cancel'}
                            </Button>
                            <Button
                                type="submit"
                                startIcon={
                                    isSubmitting ? <CircularProgress size="1rem" /> : null
                                }
                                disabled={Boolean(errors.submit) || isSubmitting}
                                variant="contained"
                            >
                                {buttonText || 'setup a button text'}
                            </Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    )
}
export default UpdateModal