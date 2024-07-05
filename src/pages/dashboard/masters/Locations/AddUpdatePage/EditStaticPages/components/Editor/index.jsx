import { useEffect, useState } from "react";
import { Box, Button, Card, Tooltip, Typography, styled } from "@mui/material";
import { Editor as ReactEditor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useNavigate } from "react-router-dom";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import useToast from "src/hooks/useToast";
import { InfoOutlined } from "@mui/icons-material";


const Editor = ({ title, editorValue, language, onChange }) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(htmlToDraft(editorValue))
    )
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(htmlToDraft(editorValue))
      )
    );
  }, [editorValue]);

  const getEditorState = () => {
    let htmlContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    return htmlContent
  }

  const onEditorStateChanged = (e) => {
    setEditorState(e);
  };

  const onUpdateClicked = async () => {
    setLoading(loading);

    let htmlContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    onChange(htmlContent)
  };

  return (
    <Box dir={'rtl'}>
      <StyledEditorCard>
        <Typography fontWeight={800}>Terms & Condition</Typography>
        <Box dir={'rtl'} className="editor-wrapper">
          <ReactEditor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChanged}
          />
          
        </Box>
        <Button onClick={() => onUpdateClicked()} variant='contained'>Save</Button>
      </StyledEditorCard>
    </Box>
  );
};

export default Editor;

const StyledEditorCard = styled(Card)(
  () => `
        width: 100%;
        padding: 10px;
        .actions-wrapper{
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
        }
        .editor-wrapper{
            margin-top: 30px;
            .editorClassName {
              border: 1px solid lightgray;
              margin-bottom: 12px;
            }
        }
        .title-wrapper{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: 50px;
            .actions-wrapper{
                .title-edit-button{
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: #7e6fd0;
                    margin-left: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
        
    `
);
