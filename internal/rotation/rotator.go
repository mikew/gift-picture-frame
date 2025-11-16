package rotation

type OutputRotator interface {
	SetRotation(degrees int) error
}
