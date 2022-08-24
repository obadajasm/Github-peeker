import { memo } from "react";
import { Repository } from "../models/repository";
import { User } from "../models/user";
import { useAppSelector } from "../store/hooks";
import Card from "./Card";
import Loading from "./Loading";

const ItemsList = ({ type, loader, shouldShow, }:
  { type: 'users' | 'repos', loader: React.RefObject<HTMLDivElement>, shouldShow: boolean }) => {
  const typeItem = useAppSelector((state) => state.github[type]) ?? null;
  let items = typeItem?.items ?? [];
  let DisplayedCard: any;
  if (type === 'users') {
    DisplayedCard = (e: User) => <Card key={e.id} title={e.login} imgSrc={e.avatar_url} />
  } else {
    DisplayedCard = (e: Repository) => (
      <Card
        key={e.id}
        title={e.name}
        secondary={e.owner.login}
        info={{
          'Forks': e.forks_count,
          'Size': e.size,
          'Open issues': e.open_issues_count,
        }}
      />
    );

  }
  return (
    items.length > 0 ?
      <>
        {
          items.map(
            (e) => (DisplayedCard(e))
          )
        }
        {
          shouldShow ? <Loading loader={loader} /> : null
        }

      </> : null
  )
}
export default memo(ItemsList);