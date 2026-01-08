import React, { useId } from "react"

export default function TextAreaWithLabel({
  textAreaName, ...props
}: {
  textAreaName: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const taid = useId();

  return (
    <>
      <label htmlFor={taid}>{textAreaName}</label>
      <br />
      <textarea id={taid} rows={props.rows} {...props} />
    </>
  )
}
