import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import classNames from 'classnames/bind';

import Category from '@/components/Category&Filter/Category/Category';
import Filter from '@/components/Category&Filter/Filter/Filter';
import Pagination from '@/components/Pagination/Pagination';
import CardResourceSmall from '@/components/CardResource/CardResourceSmall';
import { UseGetActivities } from '@/apis/apiHooks/Activities';
import styles from './ActivityListLayout.module.scss';

interface CardResourceProps {
  id: number;
  title: string;
  price: number;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
}

const cn = classNames.bind(styles);

export default function ActivityListLayout() {
  const [sort, setSort] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const categoryList = ['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'];

  const isMobile = useMediaQuery({ maxWidth: 375 });
  const isTablet = useMediaQuery({ minWidth: 745, maxWidth: 1239 });
  const isPC = useMediaQuery({ minWidth: 1240 });

  const [nowPage, setNowPage] = useState(1);
  const [size, setSize] = useState<4 | 8 | 9>(8);

  const { data, isLoading } = UseGetActivities({
    method: 'offset',
    category: category,
    sort: sort,
    page: nowPage,
    size: size,
  });
  const totalPage = Math.ceil(data?.totalCount / size);

  useEffect(() => {
    if (isPC) {
      setSize(8);
    } else if (isTablet) {
      setSize(9);
    } else if (isMobile) {
      setSize(4);
    }
  }, [isPC, isTablet, isMobile]);

  const handleCategorySelect = (index: number) => {
    setNowPage(1);
    if (category === categoryList[index]) setCategory(undefined);
    else setCategory(categoryList[index]);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    Router.push(`/activities/${id}`);
  };

  return (
    <div className={cn('container')}>
      <div className={cn('header')}>
        <Category className={cn('header_category')} list={categoryList} onSelected={handleCategorySelect} />
        <Filter filterType="activity" setFilterStatus={setSort} />
      </div>
      <div className={cn('content')}>
        <div className={cn('content_text')}>{category ? category : '🎈 모든 체험'}</div>
        <div className={cn('content_cards')}>
          {!isLoading &&
            data.activities.map((activity: CardResourceProps) => {
              return (
                <div className={cn('card')} key={`${activity.id}`} onClick={(e) => handleCardClick(e, activity.id)}>
                  <CardResourceSmall activity={activity} />
                </div>
              );
            })}
        </div>
      </div>
      <Pagination total={totalPage} nowPage={nowPage} setNowPage={setNowPage} />
    </div>
  );
}
