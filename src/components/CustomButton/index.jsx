import React from 'react'
import {
    Button, Typography, CircularProgress
} from '@mui/material';

const CustomButton = (props) => {
    const { 
        onClick,
        style,
        children,
        width,
        height,
        buttonColor,
        textColor,
        text,
        textStyle,
        disabled,
        loading,
        className,
        id,
        color
    } = props

    return (
        <Button 
            id={id}
            onClick={onClick}
            disabled={disabled}
            className={className}
            color={color}
            variant='contained'
            style={{
                width: width || '150px',
                height: height || '40px',
                opacity: disabled && '0.5',
                ...style,
            }}
        >
            {loading 
                ?   <CircularProgress style={{color: '#fff'}} size={'20px'}/>
                :   <>
                        <Typography 
                            style={{
                                color: textColor || '#fff',
                                fontWeight: '600',
                                fontSize: '15px',
                                ...textStyle
                            }}
                        >
                            {text}
                        </Typography>
                        {children}
                    </>
            }
        </Button>
    )
}
export default CustomButton