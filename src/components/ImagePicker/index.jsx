import { useEffect, useLayoutEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CustomButton from "src/components/CustomButton";
import CloudUploadTwoToneIcon from "@mui/icons-material/CloudUploadTwoTone";
import ClearIcon from "@mui/icons-material/Clear"; // icon****
import { styled } from "@mui/material/styles";
import { useImagePicker } from "src/hooks/useImagePicker";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ImagePicker = ({
  addNew,
  data,
  imageStates,
  singlePicker,
  title,
  entity,
  entityId,
  wrapperStyle,
  aspectRatio,
  isDraggable,
  component,
  deleteOld,
  canDelete = false
}) => {
  const grid = 8;
  const theme = useTheme();
  const is_small_screen = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    images,
    imagePickerRef,
    imageId,
    imagePickerLoading,
    handleSelectImage,
    handleSetImage,
    onDeleteImage,
    setSinglePicker,
  } = useImagePicker();

  const [cropperModal, setCropperModal] = useState({
    show: false,
    selectedImage: null,
  });

  const [imagesList, setImagesList] = useState([]);

  const onSelectImage = async (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      let image = new Image();
      image.src = e.target.result;

      image.onload = function () {
        const height = this.height;
        const width = this.width;
        // if (!aspectRatio) {
        //   // no aspectRatio means the image is square and it has been set to 1 * 1
        //   if (height < 800 || width < 800) {
        //     alert("Height or Width must not subceed 800px.");
        //     return;
        //   } else setCropperModal({ show: true, selectedImage: reader.result });
        // } else {
        //   // spectRatio means the image is rectangle and it has been set to 2 * 1.
        //   // I did not restrict users to upload square in 2 * 1 ratio. but this lomitioation handled in image cropper.
        //   if (component) {
        //     if (height < 300) {
        //       alert("Height must not subceed 300px.");
        //       return;
        //     } else if (width < 1029) {
        //       alert("Width must not subceed 1029px.");
        //       return;
        //     } else {
        //       setCropperModal({ show: true, selectedImage: reader.result });
        //     }
        //   } else {
        //     if (height < 600) {
        //       alert("Height must not subceed 600px.");
        //       return;
        //     } else if (width < 1080) {
        //       alert("Width must not subceed 1080px.");
        //       return;
        //     } else
        setCropperModal({ show: true, selectedImage: reader.result });
        //   }
        // }
      };
    };
    reader.readAsDataURL(files[0]);
  };

  //***** handle delete some selected image, first remove image from list of images, then remove its id from images and set it as disconnect images for api call
  const handleDeleteImage = (id) => {
    onDeleteImage(id);
    handleImageId(id, "DELETE");
  };

  const onSelectCoppedImage = async (file) => {
    if (singlePicker) {
      if (images.length >= 1) {
        // await handleDeleteImage();
        imageStates.setImageIds([])
        setImagesList([])
        handleSelectImage(file, entity, entityId, deleteOld);
      } else handleSelectImage(file, entity, entityId, deleteOld);
    } else handleSelectImage(file, entity, entityId, deleteOld);
  };

  //**** image ids should set in array for sending to create or update vehicle API
  const handleImageId = (id, type) => {
    switch (type) {
      case "ADD":
        imageStates.setImageIds((ids) => [...ids, id]);
        break;
      case "DELETE": {
        //**** here we pop deleted image from list of images and then set its id into disconnectImages for sending to backend
        let tempIds = JSON.parse(JSON.stringify(imageStates.imageIds));
        let disconnectImageId = tempIds.find((imageId) => imageId === id);
        tempIds = tempIds.filter((imageId) => imageId !== id);
        imageStates.setDisconnectImageIds((ids) => [...ids, disconnectImageId]);
        imageStates.setImageIds(tempIds);
        break;
      }
      default:
        break;
    }
  };

  //**** here we get images from data of vehicle details, put them in list of images to make them ready for any manipulation
  const handleAppendImageIdsOnUpdateMode = () => {
    if (!data) return;
    let tempImageIds = [];

    if (singlePicker) {
      data.mediaId && tempImageIds.push(data.mediaId);
    } else {
      data?.medias.forEach((image) => {
        tempImageIds.push(image.id);
      });
    }

    imageStates.setImageIds(tempImageIds);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const getListStyle = () => ({
    background: "transparent",
    padding: grid,
    width: "100%",
  });

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    height: aspectRatio === 2 ? "180px" : "100%",
    // change background colour if dragging
    background: "transparent",
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      imagesList,
      result.source.index,
      result.destination.index
    );
    setImagesList(items);
    if (imageStates.setAllImages) imageStates.setAllImages(items);
  }

  useEffect(() => {
    // **** If we are in update mode we have to append images from detail for further manipulation
    if (!addNew) handleAppendImageIdsOnUpdateMode();
    setSinglePicker(singlePicker);
  }, []);

  //*****  this hook calls when new image uploaded and we want to set its id for sending via create or update vehicle api
  useEffect(() => {
    if (imageId) handleImageId(imageId, "ADD");
  }, [imageId]);

  //****** This hook set images that has been set for a vehicle before and now we want to update them
  useEffect(() => {
    if (!addNew) {
      if (singlePicker) {
        handleSetImage(data?.medias);
      } else {
        data?.medias.forEach((image) => {
          handleSetImage(image);
        });
      }
    }
  }, [addNew]);

  

  useEffect(() => {
    if(singlePicker) {
      console.log('is here 1', images.length)
      if(images.length)  {
        console.log('is here')
       setImagesList([images[images.length - 1]]);
      }else {
        setImagesList([...images, ...imageStates.imageIds]);
      }
    }else {
      setImagesList([...images, ...imageStates.imageIds]);
    }
    
    if (imageStates.setAllImages) imageStates.setAllImages(images);
  }, [images]);

  return (
    <Box dir={'rtl'} style={{ ...wrapperStyle }}>
      <Box dir={'rtl'} display={"flex"} flexDirection="column" pb={0}>
        <Box dir={'rtl'} display={"flex"} flexDirection="row" marginLeft={1}>
          <Typography variant="subtitle2">
            {" "}
            {title || "Upload your images"}
          </Typography>
          <Typography
            variant="subtitle2"
            fontSize={"12px"}
            marginTop="4px"
            marginLeft={1}
          >
            ( JPG - PNG )
          </Typography>
        </Box>
        {!aspectRatio ? (
          <Box dir={'rtl'} display={"flex"} flexDirection="row" marginLeft={2}>
            <Typography
              variant="subtitle2"
              fontSize={"12px"}
              marginTop="4px"
              marginLeft={1}
            >

            </Typography>
          </Box>
        ) : (
          <Box dir={'rtl'} display={"flex"} flexDirection="row" marginLeft={2}>
            <Typography variant="subtitle2" fontSize={"12px"} marginTop="4px">
              {component
                ? <></>
                : <></>}
            </Typography>
          </Box>
        )}
      </Box>

      <StyledCard>
        <ImagePickerBox
          borderColor={images.length > 0 ? "#7e6fd0" : "#f33"}
          is_small_screen={is_small_screen ? true : undefined}
          onClick={() => imagePickerRef.current.click()}
        >
          <IconButton
            component="span"
            color="primary"
            style={{ width: "100%", height: "100%" }}
          >
            {imagePickerLoading ? (
              <CircularProgress size="2rem" />
            ) : (
              <CloudUploadTwoToneIcon />
            )}
          </IconButton>
        </ImagePickerBox>
      </StyledCard>
      {imagesList.length > 0 && (
        <StyledCard style={{ marginTop: "10px" }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" type="TASK">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {imagesList.map((image, index) => (
                    <Draggable
                      isDragDisabled={!isDraggable}
                      key={image.url}
                      draggableId={image.url}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <ImageListItem
                          is_small_screen={is_small_screen ? true : undefined}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <img
                            alt="img"
                            src={image.url}
                            style={{
                              width: "100%",
                              height: aspectRatio === 2 ? "150px" : "100%",
                              borderRadius: "0px",
                              objectFit: "cover",
                            }}
                          />
                          {canDelete ? <StyledClearIcon
                            onClick={() => handleDeleteImage(image.id)}
                          />: <></>}
                        </ImageListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </StyledCard>
      )}
      <Input
        accept="image/*"
        onChange={onSelectImage}
        multiple
        ref={imagePickerRef}
        onClick={(e) => (e.target.value = null)}
        type="file"
        style={{ display: "none" }}
      />
      <CopperModal
        open={cropperModal.show}
        selectedImage={cropperModal.selectedImage}
        onClose={() => setCropperModal({ show: false, value: null })}
        onSelectCoppedImage={onSelectCoppedImage}
        loading={imagePickerLoading}
        aspectRatio={aspectRatio}
        component={component}
      />
    </Box>
  );
};
export default ImagePicker;

const CopperModal = ({
  open,
  selectedImage,
  onClose,
  onSelectCoppedImage,
  aspectRatio,
  component,
}) => {
  const [image, setImage] = useState(selectedImage);
  const [cropper, setCropper] = useState();

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      const dataUrl = cropper.getCroppedCanvas().toDataURL();
      let myCroppedImageFile = dataURLtoFile(dataUrl, "someName");
      onSelectCoppedImage(myCroppedImageFile);
      onClose();
    }
  };

  function dataURLtoFile(dataUrl, filename) {
    let arr = dataUrl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  useEffect(() => {
    setImage(selectedImage);
  }, [selectedImage]);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>
        <Typography textAlign="center" variant="h4">
          Select your desired area
        </Typography>
      </DialogTitle>
      <DialogContent style={{ padding: "10px", margin: "10px" }}>
        <Cropper
          src={image}
          style={{ height: 400, width: "100%" }}
          viewMode={1}
          aspectRatio={aspectRatio || 1}
          zoomTo={0}
          //   minCropBoxHeight={10}
          //   minCropBoxWidth={10}
          minCropBoxHeight={component ? '300px' : aspectRatio ? '800px' : '800px'}
          minCropBoxWidth={component ? '1029px' : aspectRatio ? '1600px' : '800px'}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides={true}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {"Cancel"}
        </Button>
        <CustomButton text="Upload" onClick={getCropData} />
      </DialogActions>
    </Dialog>
  );
};

const Input = styled("input")({
  display: "none",
});

const ImagePickerBox = styled(Box)(
  ({ borderColor }) => `
        width: 100%;
        height: 130px;
        cursor: pointer;
        border: 2px dotted ${borderColor};
        border-radius: 8px
  `
);
const ImageListItem = styled(Box)(
  () => `
        width: 100%;
        height: 300px;
        position: relative;
        background: blue
  `
);
const StyledClearIcon = styled(ClearIcon)(
  () => `
        position: absolute;
        top: 25px;
        right: 25px;
        cursor: pointer;
        color: red
  `
);
const StyledCard = styled(Card)(
  () => `
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
  `
);
