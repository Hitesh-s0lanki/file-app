import { create } from "zustand";

const defaultValues = { title: "" };

interface ICreateModal {
    isOpen: boolean;
    initialValues: typeof defaultValues;
    onOpen: (title: string) => void;
    onClose: () => void;
};

export const useCreateModal = create<ICreateModal>((set) => ({
    isOpen: false,
    onOpen: (title) => set({
        isOpen: true,
        initialValues: { title },
    }),
    onClose: () => set({
        isOpen: false,
        initialValues: defaultValues,
    }),
    initialValues: defaultValues,
}));