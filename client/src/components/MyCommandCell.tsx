import { Button, ButtonProps, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

const Button1 = styled(Button)<ButtonProps>(({ theme }) => ({
    color: '#ef4444',
    backgroundColor: grey[100],
    margin:'2px',
    border:'1px solid #ef4444',
    fontWeight:'bold',
    '&:hover': {
        backgroundColor: '#ffebee',
    },
}));
const Button2 = styled(Button)<ButtonProps>(({ theme }) => ({
    color: '#2b2b2b',
    backgroundColor: grey[100],
    border:'1px solid #2b2b2b',
    margin:'2px',
    fontWeight:'bold',
    '&:hover': {
      backgroundColor: grey[300],
    },
  }));

export default function MyCommandCell(props:any){
    const {dataItem,role} = props;
    const inEdit = dataItem[props.editField]
    const isNewItem = dataItem.id === undefined;
    return inEdit ? 
        (
            <td className="k-command-cell">
                <Button1 disabled={role==="ADMIN"?false:true} onClick={()=>isNewItem?props.add(dataItem):props.update(dataItem)}>
                    {isNewItem ? 'Add' : 'Update'}
                </Button1>
                <Button2 disabled={role==="ADMIN"?false:true} onClick={()=>isNewItem ? props.discard():props.cancel()}>
                    {isNewItem ? 'Discard' : 'Cancel'}
                </Button2>
            </td>
        )
            :
        (
            <td className="k-command-cell">
                <div className="">
                    <Button1 disabled={role==="ADMIN"?false:true} onClick={()=>props.edit(dataItem)}>
                        Edit
                    </Button1>
                    <Button2 disabled={role==="ADMIN"?false:true} onClick ={()=>props.remove(dataItem)}>
                        Remove
                    </Button2>
                </div>
            </td>
        )
}