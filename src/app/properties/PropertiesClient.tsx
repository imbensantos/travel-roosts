"use client"

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Listing, User } from '@prisma/client'
import axios from 'axios'
import toast from 'react-hot-toast'

import Container from '@components/Container'
import Heading from '@components/Heading'
import ListingCard from '@components/Listings/ListingCard'
import useRentModal from '@hooks/useRentModal'
import { LocationType } from "@/types"

interface PropertiesClientProps {
  listings: Listing[],
  currentUser?: User | null,
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({ listings, currentUser }) => {
  const router = useRouter()
  const rentModal = useRentModal()

  const [deletingId, setDeletingId] = useState('')

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id)
      axios.delete(`/api/listings/${id}`)
        .then(() => {
          toast.success('Listing deleted')
          router.refresh()
        })
        .catch(error => toast.error(error?.response?.data?.error))
        .finally(() => { setDeletingId('') })
    },
    [router],
  )

  const onEdit = ((data: Listing, location: LocationType) => {
    rentModal.onOpen({ ...data, location })
  })

  return (
    <Container>
      <Heading
        title="Properties"
        subtitle="List of your properties"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map(listing => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onCancel}
            onSecondaryAction={onEdit}
            disabled={deletingId === listing.id}
            actionLabel='Delete property'
            secondaryActionLabel='Edit property'
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  )
}

export default PropertiesClient