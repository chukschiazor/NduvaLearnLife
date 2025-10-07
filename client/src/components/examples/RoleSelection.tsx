import RoleSelection from '../RoleSelection'

export default function RoleSelectionExample() {
  return <RoleSelection onSelectRole={(role) => console.log('Selected role:', role)} />
}
