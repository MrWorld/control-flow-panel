import React from 'react'
import {
    Box,
    styled,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const EditButton = ({ onClick, disabled, style, iconStyle, size, children }) => {
    return (
        <StyledEditButton onClick={onClick} disabled={disabled} style={{width: size && `${size}px` , height: size && `${size}px` , ...style}}>
            {children 
                ? children
                : <EditIcon style={{ color: '#fff', width: size && `${size - 10}px`, height: size && `${size - 10}px`, ...iconStyle }} fontSize='small' />
            }
        </StyledEditButton>
    )
}
export default EditButton

const StyledEditButton = styled(Box)(
    ({ disabled }) => `
          width: 25px;
          height: 25px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #7e6fd0;
          cursor: ${!disabled && 'pointer'};
          opacity: ${disabled && '0.5'}
    `
);