import { listMocks } from '../loaders/listMocks.js';

class MockService {
    async list() {
        return listMocks();
    }
}

export const mockService = new MockService();
