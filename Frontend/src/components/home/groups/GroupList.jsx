import React, { useState } from "react";
import GroupCard from "./GroupCard";
import CreateGroupModal from "./CreateGroupModal";
import { Button } from "@/components/ui/button";
import useQuery from "@/hooks/useQuery";
import { useNavigate } from "react-router-dom";
import JoinGroup from "./JoinGroup";
// import { Button } from "../components/ui/button";

export default function GroupsList() {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isJoinOpen, setJoinOpen] = useState(false);

  const { data: groups, refetch } = useQuery("api/groups/my");

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Your Groups</h2>
        <div className="flex flex-row gap-3">
          <Button onClick={() => setJoinOpen(true)}>Join Group</Button>
          <Button onClick={() => setModalOpen(true)}>Create Group</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups?.data?.data?.map((g) => (
          <GroupCard
            key={g.id}
            name={g.groupName}
            avatars={g.avatars}
            inviteCode={g.inviteCode}
            users={g?.usersList || []}
            netBalance={g.netBalance}
            baseCurrency={g.baseCurrency}
            onClick={() => navigate(`/home/groups/${g.id}`, {
              state: g,
            })}
          />
        ))}
      </div>

      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        refetch={refetch}
      />

      <JoinGroup
        isOpen={isJoinOpen}
        onClose={() => setJoinOpen(false)}
        refetch={refetch}
      />
    </div>
  );
}