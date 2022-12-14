import { DropDownList } from '@progress/kendo-react-dropdowns';

export default function GenderCell(props:any){
    return props.dataItem.inEdit?(<td>
        <DropDownList
          value={props.dataItem[props.field]}
          data= {props.data}
          onChange={(e) => props.onChange({
            dataItem: props.dataItem,
            field: props.field,
            syntheticEvent: e.syntheticEvent,
            value: e.value
          })}
        />
      </td>) :<td>{props.dataItem.gender}</td>
;
}