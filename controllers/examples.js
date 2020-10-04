import Example from '../models/Example';

export const createExample = (data) => {
    const example = new Example(data);
    return example.save();
};