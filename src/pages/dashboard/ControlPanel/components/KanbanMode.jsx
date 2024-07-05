/* eslint-disable no-undef */
import React from "react";
import {
  Typography,
  styled,
  Tooltip,
  IconButton,
  Avatar,
  Card,
  Box,
} from "@mui/material";
// import useToast from '../../../../../hooks/useToast'
import { parcelKanbanColumns } from "../constants/index";
import KeyTagCards from "./cards";

Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

const KanbanKeys = ({ items, update, setter, handleRefresh }) => {
  const handleInfinitScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      console.log("handle get new items here");
    }
  };

  return (
    <StyledKanbanWrapper>
      {Object.entries(parcelKanbanColumns).map(([columnKey, columnValue]) => {
        return (
          <StyledKanbanBox key={columnKey}>
            <Typography fontSize={12}>{columnValue.title2}</Typography>
            <Card className="card-body" onScroll={handleInfinitScroll}>
              {items
                .filter((p) => p.status.title === columnValue.title.capitalize())
                .map((item, index) => (
                  <KeyTagCards key={index} data={item} handleRefresh={handleRefresh} isKanban={true} />
                ))}
            </Card>
          </StyledKanbanBox>
        );
      })}
    </StyledKanbanWrapper>
  );
};

export default KanbanKeys;


const StyledKanbanWrapper = styled(Box)`
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap:
    width: 100%;
    height: 65.7vh;
    overFlow-x: scroll;
    margin-left: 10px;
    padding: 20px;
`;
const StyledKanbanBox = styled(Box)`
  .card-title {
    font-size: 15px;
    font-weight: 700;
  }
  .card-body {
    width: 122px;
    height: calc(100% - 20px);
    margin-right: 10px;
    flex-shrink: 0;
    padding: 8px;
    overflow-y: scroll;
  }
`;
