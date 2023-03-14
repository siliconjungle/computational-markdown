import ReactJson from 'react-json-view'

// This is possible - we'd just need to onEdit / add update the crdts.
const JSONViewer = ({ value }) => (
  <ReactJson
    src={value ?? {}}
    collapsed={true}
    enableClipboard={true}
    iconStyle="square"
    // onEdit={() => {}}
    // onAdd={() => {}}
    theme="colors"
  />
)

export default JSONViewer
