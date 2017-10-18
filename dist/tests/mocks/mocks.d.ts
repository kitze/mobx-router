/// <reference types="jest" />
declare const mocks: {
    enteringHome: jest.Mock<{}>;
    exitingHome: jest.Mock<{}>;
    enteringProfile: jest.Mock<{}>;
    exitingProfile: jest.Mock<{}>;
    changingParamsProfile: jest.Mock<{}>;
    changingParamsHome: jest.Mock<{}>;
};
export default mocks;
