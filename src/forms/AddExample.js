import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { map, compact, trim } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { EXAMPLE_SUGGESTIONS_API_URL } from '../config';

const inputStyles = 'h-10 w-full border-current border-solid border border-gray-600 rounded-md px-3 py-5';
const submitButtonStyles = 'h-10 mt-5 lg:h-10 w-full lg:w-32 bg-green-600 rounded text-gray-100';
const cancelButtonStyles = 'h-10 mt-5 lg:h-10 lg:w-32 text-gray-600';
const formHeader = 'text-xl mb-2 mt-5';
const errorStyles = 'text-red-500 mt-3';

const AddExample = ({
  onRequestClose,
  onSuccess,
  onFailure,
  defaultValues,
}) => {
  const {
    handleSubmit,
    getValues,
    reset,
    control,
    errors,
  } = useForm();

  const onSubmit = (data) => {
    const cleanedData = {
      ...data,
      definitions: compact(map(data.definitions, (definition) => trim(definition))),
      variations: compact(map(data.variations, (variation) => trim(variation))),
      originalWordId: defaultValues?.id || null,
    };
    axios
      .post(EXAMPLE_SUGGESTIONS_API_URL, cleanedData)
      .then(() => {
        reset();
        onSuccess({ subtitle: 'You\'re example has been sent for review by editors.' });
      })
      .catch(() => {
        onFailure({ subtitle: 'Double check you have entered all required information.' });
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="mt-2">
        By suggesting a new example, you are helping in advancing learning materials for the Igbo language.
      </p>
      <p className="mt-2">
        {`If only Igbo is provided, then an English translation will be added later, 
        and the same will happen if an English sentence if sent.`}
      </p>
      <p className="mt-2 font-bold">
        {'Please provide an example, either in Igbo, or English, or both, that contains the associated word '}
        <span className="font-bold underline">{defaultValues?.word}</span>
      </p>
      <h2 className={formHeader}>Igbo</h2>
      <Controller
        as={(
          <input
            className={`${inputStyles}`}
            placeholder={`Example in Igbo using ${defaultValues?.word}`}
            data-test="igbo-input"
          />
        )}
        name="igbo"
        control={control}
        defaultValue={defaultValues?.igbo || getValues().igbo}
      />
      {errors.igbo && (
        <span className={errorStyles}>Either the Igbo or English sentence if required</span>
      )}
      <h2 className={formHeader}>English</h2>
      <Controller
        as={(
          <input
            className={inputStyles}
            placeholder={`Example in English using ${defaultValues?.word}`}
            data-test="english-input"
          />
        )}
        name="english"
        control={control}
        defaultValue={defaultValues?.english || getValues().english}
      />
      <div className="flex flex-col lg:flex-row-reverse lg:justify-start">
        <button type="submit" className={submitButtonStyles}>Submit</button>
        <button
          type="button"
          className={cancelButtonStyles}
          onClick={() => {
            reset();
            onRequestClose();
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

AddExample.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  defaultValues: PropTypes.objectOf(['word']),
};

AddExample.defaultProps = {
  onSuccess: () => {},
  onFailure: () => {},
  defaultValues: {},
};

export default AddExample;
