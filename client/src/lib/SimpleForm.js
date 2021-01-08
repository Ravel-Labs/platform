/* 
field:
  label
  name
  type
  defaultValue
*/

export default function SimpleForm({ fields, onSubmit, isDisabled, submitText }) {
  const onFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const values = {};
    fields.forEach((field) => {
      values[field.name] = form[field.name].value;
    })

    onSubmit(values);
  }

  return (
    <form onSubmit={onFormSubmit} disabled={isDisabled}>
      {fields.map((field) => (
        <label htmlFor={field.name} key={field.name}>
          <>{field.label}</>
          <input 
            type={field.type} 
            name={field.name} 
            defaultValue={field.defaultValue} 
            required={field.required} 
          />
        </label>
      ))}
      <button type="submit">{submitText || "Submit"}</button>
    </form>
  )
}