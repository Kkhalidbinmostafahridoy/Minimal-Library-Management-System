import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types matching for backend models
export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description: string;
  copies: number;
  available: boolean;
}

export interface PaginatedBooks {
  books: Book[];
  total: number;
  page: number;
  pages: number;
}

export interface BorrowSummary {
  bookTitle: string;
  isbn: string;
  totalQuantityBorrowed: number;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, // ✅ dynamic, not hardcoded
  }),
  tagTypes: ["Book", "BorrowSummary"],
  endpoints: (builder) => ({
    getBooks: builder.query<PaginatedBooks, { page: number; limit: number }>({
      query: ({ page = 1, limit = 10 }) => `books?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.books.map(({ _id }) => ({
                type: "Book" as const,
                id: _id,
              })),
              { type: "Book", id: "LIST" },
            ]
          : [{ type: "Book", id: "LIST" }],
    }),

    getBook: builder.query<Book, string>({
      query: (id) => `books/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Book", id }],
    }),

    addBook: builder.mutation<Book, Omit<Book, "_id">>({
      query: (newBook) => ({
        url: "books",
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: [{ type: "Book", id: "LIST" }],
    }),

    updateBook: builder.mutation<Book, Partial<Book> & { _id: string }>({
      query: ({ _id, ...patch }) => ({
        url: `books/${_id}`,
        method: "PATCH",
        body: patch,
      }),
      async onQueryStarted(
        { _id, ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        // More robust optimistic update
        const state = getState();
        const queryArgs = state.api.queries[`getBooks`]?.originalArgs || {
          page: 1,
          limit: 10,
        };

        const patchResult = dispatch(
          api.util.updateQueryData("getBooks", queryArgs, (draft) => {
            const bookIndex = draft.books.findIndex((book) => book._id === _id);
            if (bookIndex !== -1) {
              Object.assign(draft.books[bookIndex], patch);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { _id }) => [
        { type: "Book", id: _id },
        { type: "Book", id: "LIST" },
      ],
    }),

    deleteBook: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Book", id: "LIST" }],
    }),

    borrowBook: builder.mutation<
      void,
      { bookId: string; quantity: number; dueDate: string }
    >({
      query: (borrowData) => ({
        url: "borrows",
        method: "POST",
        body: borrowData,
      }),
      invalidatesTags: (_result, _error, { bookId }) => [
        { type: "Book", id: bookId },
        { type: "Book", id: "LIST" },
        "BorrowSummary",
      ],
    }),

    getBorrowSummary: builder.query<BorrowSummary[], void>({
      query: () => "borrows/summary",
      providesTags: ["BorrowSummary"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useGetBorrowSummaryQuery,
} = api;
