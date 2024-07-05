import { Button, Tooltip } from '@mui/material';
import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'

const ExcelExport = ({jsonData, name}) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx'

    const exportToExcel = async () => {
        console.log(jsonData)
        const ws = XLSX.utils.json_to_sheet(jsonData)
        const wb = { Sheets: {'data': ws}, SheetNames: ['data']}
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array'})
        const data = new Blob([excelBuffer] , {type: fileType})
        FileSaver.saveAs(data, name + fileExtension)
    }

    return (
        <>
            {/* <Tooltip title="export"> */}
                <Button style={{ marginLeft: '10px' }} variant='contained'
                    onClick={(e) => exportToExcel(name)}
                    >
                    Export
                </Button>
            {/* </Tooltip> */}
        </>
    )
}

export default ExcelExport