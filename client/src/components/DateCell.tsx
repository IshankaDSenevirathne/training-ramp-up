import { DatePicker } from '@progress/kendo-react-dateinputs';

export default function DateCell(props:any){
    return props.dataItem.inEdit?(<td>
        <DatePicker
          width="100%"
          value={props.dataItem[props.field]}
          format="yyyy-MM-dd"
          onChange={(e) => props.onChange({
            dataItem: props.dataItem,
            field: props.field,
            syntheticEvent: e.syntheticEvent,
            value: e.value
          })}
        />
      </td>) :<td>{new Date(props.dataItem.dob).toDateString()}</td>
;
}