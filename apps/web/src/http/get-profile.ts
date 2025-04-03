import { api } from './api-client';

interface GetProfileResponse {
    user: {
        id: string;
        avatarUrl?: string;
        nickname: string;
        status: string;
        levelProgress: true;
        nextLevelGoal: true;
    };
}

export async function getProfile() {
    const response = await api.get('profile').json<GetProfileResponse>();

    return response;
}
