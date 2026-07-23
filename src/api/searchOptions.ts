import type { SearchDetails, SearchOptions } from "../types/searchOptins";

const delay = (ms: number)=> new Promise(resolve => setTimeout(resolve, ms));

export async function getSearchOptions():Promise<SearchOptions[]> {
    await delay(1000);

    return [
        { key: '1', value: 'option1', label: 'Option 1' },
        { key: '2', value: 'option2', label: 'Option 2' },
        { key: '3', value: 'option3', label: 'Option 3' },
        { key: '4', value: 'option4', label: 'Option 4' },
        { key: '5', value: 'option5', label: 'Option 5' },
    ];

}

export async function getSearchDetailsById(id: string): Promise<SearchDetails> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: `${id}`,
                name: 'John Doe',
                email: 'johnDoe@mail.com',
            });
        }, 1000);
    });
}