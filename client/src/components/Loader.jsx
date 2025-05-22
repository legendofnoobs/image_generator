import { SpinnerCircular } from 'spinners-react';

const Loader = () => {
    return (
        <div>
            <SpinnerCircular size={50} thickness={180} speed={100} color="rgba(106, 57, 172, 1)" secondaryColor="rgba(0, 0, 0, 0.44)" />
        </div>
    )
}

export default Loader