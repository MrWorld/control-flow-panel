import React, { useState } from "react";
import {
  TableCell,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  Card,
} from "@mui/material";
import CustomButton from "src/components/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCheckPermission } from "src/hooks/useCheckPermission";
import useToast from "src/hooks/useToast";
const OrderRow = ({ data, onDelete }) => {
  const { checkPermission } = useCheckPermission();
  const { toast } = useToast();
  const [confirmModal, setConfirmModal] = useState(false);

  const getDate = (dateTime) => {
    let date = dateTime;
    if (dateTime.includes("T")) {
      date = dateTime.split("T")?.[0];
    }
    return date;
  };
  const deleteCoupon = () => {
    if (!checkPermission("REVOKE_COUPON")) {
      toast("You have not permission to delete coupon", "error");
      return true;
    }
    onDelete(data);
    setConfirmModal(false);
  };
  const getRemaining = (limit, use) => {
    if (limit) {
      if (limit !== -1) {
        return limit - use;
      } else {
        return "UNLIMITED";
      }
    }
  };
  const calculateStatus = (data) => {
    if (data?.isDisabled && data?.isDeleted) {
      return ['REVOKE', '#ff2a04']
    } else if (data.useCount && data.limitCount && data?.useCount > data?.limitCount) {
      return ["LIMIT EXCEED", '#ff8c00']
    } else if (data?.toDate && new Date(data?.toDate) > Date.now()) {
      return ["EXPIRED", '#666666']
    }else{
      return ["ACTIVE", '#008000']
    }
  }

  return (
    <>
      <TableRow hover key={data.id}>
        <TableCell align="right">
          <Typography noWrap style={{ fontWeight: 900 }}>
            {data?.id}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography noWrap style={{ fontWeight: 900 }}>
            {data?.amount}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography fontSize={14} fontWeight="800" textTransform="capitalize">
            {data?.code}
          </Typography>
        </TableCell>
        <TableCell style={{ width: "200px" }}>
          <Typography fontSize={14} fontWeight="800">
            {data?.fromDate === null ? "UNLIMITED" : getDate(data.fromDate)}
          </Typography>
        </TableCell>
        <TableCell style={{ width: "200px" }}>
          <Typography fontSize={14} fontWeight="800">
            {data?.toDate === null ? "UNLIMITED" : getDate(data.toDate)}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography fontSize={14} fontWeight="800">
            <StyledStatusCard
              style={{
                width: "120px",
                minWidth: "80px",
                background: calculateStatus(data)?.[1]
              }}
            >
              <Typography variant="h5" style={{ color: "#fff" }}>
                {calculateStatus(data)?.[0]}
              </Typography>
            </StyledStatusCard>
          </Typography>
        </TableCell>
        <TableCell>
          <Typography fontSize={14} fontWeight="800">
            {data?.limitCount}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography fontSize={14} fontWeight="800">
            {data?.type === "PERCENTAGE" ? "%" : "KD"}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography fontSize={14} fontWeight="800">
            {getRemaining(data?.limitCount, data?.useCount)}
          </Typography>
        </TableCell>
        <TableCell align="right">
          {!data.isDeleted && !data.isDisabled && (
            <Typography fontSize={14} fontWeight="800">
              <DeleteIcon
                style={{ cursor: "pointer", color: " #7e6fd0" }}
                onClick={() => setConfirmModal(true)}
              />
            </Typography>
          )}
        </TableCell>
      </TableRow>
      <ConfirmModal
        show={confirmModal}
        onHide={() => setConfirmModal(false)}
        deleteCoupon={deleteCoupon}
      />
    </>
  );
};

export default OrderRow;

const ConfirmModal = ({ show, onHide, deleteCoupon }) => {
  return (
    <Dialog fullWidth maxWidth="md" open={show} onClose={onHide}>
      <DialogTitle>
        <Typography variant="h3">Warning</Typography>
      </DialogTitle>
      <DialogContent style={{ padding: "10px", margin: "10px" }}>
        <Typography variant="h4">
          Are you sure? Do you want revoke this coupon?
        </Typography>
      </DialogContent>
      <DialogActions>
        <CustomButton
          text={"Yes"}
          style={{ backgroundColor: "#f33" }}
          onClick={deleteCoupon}
        />
        <CustomButton text={"No"} onClick={onHide} />
      </DialogActions>
    </Dialog>
  );
};

const StyledStatusCard = styled(Card)(
  () => `
        width: 100px;
        height: 50px;
        box-shadow: none;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase
  `
);