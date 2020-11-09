import React from 'react';
import PropTypes from 'prop-types';
import { map, compact, trim } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import { postExampleSuggestion } from '../API';

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
    postExampleSuggestion(cleanedData)
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
      <h2 className="form-header">Igbo</h2>
      <Controller
        as={(
          <input
            className="form-input"
            placeholder={`Example in Igbo using ${defaultValues?.word}`}
            data-test="igbo-input"
          />
        )}
        name="igbo"
        control={control}
        defaultValue={defaultValues?.igbo || getValues().igbo}
      />
      {errors.igbo && (
        <span className="error">Either the Igbo or English sentence if required</span>
      )}
      <h2 className="form-header">English</h2>
      <Controller
        as={(
          <input
            className="form-input"
            placeholder={`Example in English using ${defaultValues?.word}`}
            data-test="english-input"
          />
        )}
        name="english"
        control={control}
        defaultValue={defaultValues?.english || getValues().english}
      />
      <h2 className="form-header">Email</h2>
      <p className="form-subheader">
        By providing your email, you will get notifications about the status of your submission.
      </p>
      <Controller
        as={<input className="form-input" placeholder="uche@gmail.com" data-test="email-input" />}
        name="userEmail"
        type="email"
        control={control}
        defaultValue={defaultValues?.userEmail || getValues().userEmail}
      />
      <div className="flex flex-col items-start lg:items-end">
        <div className="flex flex-col w-full lg:flex-row-reverse lg:justify-start">
          <button type="submit" className="button primary-button">Submit</button>
          <button
            type="button"
            className="button"
            onClick={() => {
              reset();
              onRequestClose();
            }}
          >
            Cancel
          </button>
        </div>
        <p className="font-bold mt-3 text-center lg:text-right">
          {`By clicking 'Submit' your example suggestion will be sent 
          to our editors to be reviewed and later approved or denied.`}
        </p>
        <p className="font-bold mt-3 underline text-center lg:text-right">
          Before submitting, double check your edits.
        </p>
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
