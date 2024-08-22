// Define a type for a function that takes any data and returns a buffer
type SerializeFunction = (data: any) => buffer;

// Define a type for a function that takes a buffer and returns any data
type DeserializeFunction = (buffer: buffer) => any;

// Use these function types to define the BufferSerializer type
type BufferSerializer = {
    serialize: SerializeFunction;
    deserialize: DeserializeFunction;
}

export default function BufferWrapper(): BufferSerializer;