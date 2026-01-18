export interface FamilyMember {
    id: string;
    name: string;
    birthDate: string;
    deathDate?: string;
    gender: 'male' | 'female';
    avatar?: string;
    spouses: string[]; // IDs of spouses
    children: string[]; // IDs of children
    parents: string[]; // IDs of parents
    bio?: string;
}

export interface FamilyNodeData {
    primary: FamilyMember;
    partner?: FamilyMember;
    children: string[];
    label: string;
}
