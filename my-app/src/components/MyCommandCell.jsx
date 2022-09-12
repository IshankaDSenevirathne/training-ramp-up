import * as React from "react"

export default function MyCommandCell(props){
    const {dataItem} = props;
    const inEdit = dataItem[props.editField]
    const isNewItem = dataItem.id === undefined;
    return inEdit ? 
        (
            <td className="k-command-cell">
                <button style={{background:"#ef4444",color:"#fff"}} className="k-button k-button-md k-rounded-md" onClick={()=>isNewItem?props.add(dataItem):props.update(dataItem)}>
                    {isNewItem ? "Add" : "Update"}
                </button>
                <button className="k-button k-button-md k-rounded-md" onClick={()=>isNewItem ? props.discard():props.cancel(dataItem)}>
                    {isNewItem ? "Discard" : "Cancel"}
                </button>
            </td>
        )
            :
        (
            <td className="k-command-cell">
                <button style={{background:"#ef4444",color:"#fff"}} className="k-button k-button-md k-rounded-md">
                    Edit
                    </button>
                <button className="k-button k-button-md k-rounded-md">
                    Remove
                </button>
            </td>
        )
}