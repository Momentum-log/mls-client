import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelAccountChange,
  getAccountChangeStatus,
  requestBusinessAccount,
  requestIndividualAccount,
  type AccountChangeStatus,
} from "@/api/auth";

const key = ["account", "change-status"] as const;

/** Business / individual change status of the signed-in account. */
export const useAccountChangeStatus = () =>
  useQuery<AccountChangeStatus, Error>({ queryKey: key, queryFn: getAccountChangeStatus, staleTime: 30_000 });

const useRefreshing = <TVars,>(fn: (vars: TVars) => Promise<unknown>) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, TVars>({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};

export const useRequestBusinessAccount = () =>
  useRefreshing((data: { companyName: string; nip: string }) => requestBusinessAccount(data));

export const useRequestIndividualAccount = () =>
  useRefreshing((data: { reason: string }) => requestIndividualAccount(data));

export const useCancelAccountChange = () => useRefreshing((id: string) => cancelAccountChange(id));
