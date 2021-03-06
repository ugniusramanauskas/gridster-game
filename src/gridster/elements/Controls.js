import React from "react";
import IntegerInput from "./controls/IntegerInput";
import InputSeparator from "./controls/InputSeparator";
import { useForm } from "react-hook-form";
import Button from "./controls/Button";

function Controls({ defaultRows, defaultColumns, handleChange }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const { rows, columns } = data;
    handleChange(rows, columns);
  };

  return (
    <div className="game-controls">
      <form className="controls-form" onSubmit={handleSubmit(onSubmit)}>
        <IntegerInput
          name="rows"
          label="Rows"
          defaultVal={defaultRows}
          register={register}
        />
        <InputSeparator />
        <IntegerInput
          name="columns"
          label="Columns"
          defaultVal={defaultColumns}
          register={register}
        />
        <Button type="submit" />
      </form>
    </div>
  );
}

export default Controls;
