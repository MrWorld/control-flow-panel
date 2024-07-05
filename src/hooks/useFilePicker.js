import { useState, useRef } from 'react'
import axios from 'axios'
import { getAuthorization } from 'src/utils/getAuthorization'
import useToast from 'src/hooks/useToast' 
import { baseURL } from 'src/constants/apiBaseUrl'

// **** logic needs update. we have to consider api call. generating order id and sending list of id and listOrder of an image to components
export const useFilePicker = () => {
    const imagePickerRef = useRef()
    const { toast } = useToast()
    const [images, setImages] = useState([])
    const [imageId, setImageId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [singlePicker, setSinglePicker] = useState(false)

    //**** this is for uploading new images
    const handleSelectImage = async (file, entity, entityId, deleteOld = true) => {
        if(loading && singlePicker) return 
        //******** handle send image file to server after upload finished and wait till it give you an ID of the image
        const authorization = getAuthorization('token')
        const config = {
            onUploadProgress: function() {
                //****** let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            },
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: authorization
            },
        }

        const imageFile = file
        const imageURL = URL.createObjectURL(imageFile)
        const formData = new FormData();
        formData.set("files", imageFile);
        formData.set('target', entity)
        formData.set('targetId', entityId)
        formData.set('deleteOld', deleteOld)

        try{
            setLoading(true)
            let res = await axios.post(baseURL+'/v1/storage/upload', formData, config)
            // toast(res.data.message)
            setLoading(false)
            setImages(images => [
                ...images, 
                {
                    url: imageURL,
                    file: file,
                    // id: res.data.data.id,
                }
            ])
            // setImageId(res.data.data.id)
        }catch(error) {
            toast(error.response.data.message, 'error')
            setLoading(false)
        }
    }

    //**** this is for images came from api and set on form update
    const handleSetImage = (image) => {
        if(!image) return
        setImages(images => [
            ...images, 
            {
                url: image.url,
                file: '',
                id: image.id,
            }
        ])
    }

    //**** this is for delete some image */
    const onDeleteImage = (id) => {
        console.log('am i here again ?', id)
        let tempImages = images.map(obj => ({...obj}))
        tempImages = tempImages.filter(tempImage => tempImage.id !== id)
        console.log(tempImages)
        setImages(tempImages)
    }

    return {
        images,
        imagePickerRef,
        imageId,
        imagePickerLoading: loading,
        handleSelectImage: handleSelectImage,
        handleSetImage: handleSetImage,
        onDeleteImage: onDeleteImage,
        setSinglePicker: setSinglePicker
    }
}