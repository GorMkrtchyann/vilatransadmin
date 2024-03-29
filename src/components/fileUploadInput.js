import {IconCloudUpload} from "@tabler/icons-react";


export const FileUploadInput = ({onChange, inputRef, text = 'Upload File', required = true}) => {

    return(
        <div className={'uploadFile'}>
            <IconCloudUpload />
            <p>{text}</p>
            <input type="file" onChange={(e) => onChange(e.target.files)}
                   ref={inputRef} required={required}
            />
        </div>
    )
}